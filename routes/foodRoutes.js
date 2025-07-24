const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  protect,
  isAdmin,
  isRestaurantOwnerOrAdmin,
  canAccessFoodItem
} = require('../middleware/auth');

const {
  createFood,
  getAllFoods,
  getMyFoods,
  getFoodById,
  updateFood,
  deleteFood,
  updateFoodStock,
  getAllFoodsForAdmin
} = require('../controllers/foodController');

// ✅ Cloudinary upload setup
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// ✅ Routes

// Add food (restaurant owners & admin)
router.post('/', protect, isRestaurantOwnerOrAdmin, upload.single('image'), createFood);

// Public: get all available foods
router.get('/', getAllFoods);

// Restaurant/Admin: get own foods
router.get('/my-foods', protect, isRestaurantOwnerOrAdmin, getMyFoods);

// Get single food by ID
router.get('/:id', protect, getFoodById);

// Update food item
router.put('/:id', protect, canAccessFoodItem, upload.single('image'), updateFood);

// Delete food
router.delete('/:id', protect, canAccessFoodItem, deleteFood);

// Toggle in-stock status
router.patch('/:id/stock', protect, canAccessFoodItem, updateFoodStock);

// Admin-only: get all foods
router.get('/admin/all', protect, isAdmin, getAllFoodsForAdmin);

module.exports = router;

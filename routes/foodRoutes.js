// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant'); // Ensure this is imported
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
router.post('/', protect, isRestaurantOwnerOrAdmin, upload.single('image'), createFood);

// ✅ Get all foods (public route for customers)
router.get('/', getAllFoods);

// ✅ Get foods for the authenticated restaurant owner or admin
router.get('/my-foods', protect, isRestaurantOwnerOrAdmin, getMyFoods);

// ✅ Get single food item
router.get('/:id', protect, getFoodById);

// ✅ Update food item (for restaurant owners and admins)
router.put('/:id', protect, canAccessFoodItem, upload.single('image'), updateFood);

// ✅ Delete food (for restaurant owners and admins)
router.delete('/:id', protect, canAccessFoodItem, deleteFood);

// ✅ Toggle food stock status
router.patch('/:id/stock', protect, canAccessFoodItem, updateFoodStock);

// ✅ Admin-only: Get all foods for admin dashboard
router.get('/admin/all', protect, isAdmin, getAllFoodsForAdmin);

module.exports = router;
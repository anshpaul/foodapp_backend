// middleware/auth.js
const jwt = require('jsonwebtoken');

// Protect middleware: verifies token and extracts user info
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin-only middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// Restaurant owner or admin middleware - for food management
const isRestaurantOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Allow admins to manage all food items
    if (req.user.role === 'admin') {
      return next();
    }

    // Allow restaurant owners to manage their own food items
    if (req.user.role === 'restaurant') {
      // You'll need to import your Restaurant model here
      const Restaurant = require('../models/Restaurant'); // Adjust path as needed
      
      // Find the restaurant owned by this user
      const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
      
      if (!restaurant) {
        return res.status(404).json({ 
          message: 'Restaurant profile not found. Please create your restaurant profile first.' 
        });
      }

      // Add restaurant ID to request for use in controllers
      req.restaurantId = restaurant._id;
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied: Only restaurant owners and admins can manage food items' 
    });

  } catch (error) {
    console.error('Restaurant permission check error:', error);
    return res.status(500).json({ message: 'Permission check failed' });
  }
};

// Middleware to check if user can access specific food item (for edit/delete operations)
const canAccessFoodItem = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Admins can access all food items
    if (req.user.role === 'admin') {
      return next();
    }

    // Restaurant owners can only access their own food items
    if (req.user.role === 'restaurant') {
      const Food = require('../models/Food'); // Adjust path as needed
      const Restaurant = require('../models/Restaurant'); // Adjust path as needed
      
      // Find the restaurant owned by this user
      const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
      
      if (!restaurant) {
        return res.status(404).json({ 
          message: 'Restaurant profile not found' 
        });
      }

      // Check if the food item belongs to this restaurant
      const foodItem = await Food.findById(req.params.id);
      
      if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }

      if (foodItem.restaurantId.toString() !== restaurant._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied: You can only manage your own restaurant\'s food items' 
        });
      }

      req.restaurantId = restaurant._id;
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied: Only restaurant owners and admins can manage food items' 
    });

  } catch (error) {
    console.error('Food item access check error:', error);
    return res.status(500).json({ message: 'Permission check failed' });
  }
};

module.exports = { 
  protect, 
  isAdmin, 
  isRestaurantOwnerOrAdmin, 
  canAccessFoodItem 
};
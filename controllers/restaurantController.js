const Restaurant = require('../models/Restaurant');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Create an 'uploads' folder in your project root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ✅ Create or Update restaurant (restaurant login)
exports.createOrUpdateRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne({ ownerId: req.user.userId });

    if (existing) {
      const updated = await Restaurant.findOneAndUpdate(
        { ownerId: req.user.userId },
        { ...req.body, status: 'pending' },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    const restaurant = new Restaurant({
      ...req.body,
      ownerId: req.user.userId
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all pending restaurants (admin)
exports.getPendingRestaurants = async (req, res) => {
  try {
    const pending = await Restaurant.find({ status: 'pending' });
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Approve restaurant (admin)
exports.approveRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.status(200).json({ message: 'Restaurant approved', restaurant: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all approved restaurants (frontend use)
exports.getApprovedRestaurants = async (req, res) => {
  try {
    const approved = await Restaurant.find({ status: 'approved' });
    res.status(200).json(approved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin can delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Check if restaurant exists for logged-in restaurant user
exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });

    if (!restaurant) {
      return res.status(404).json({ exists: false });
    }

    return res.status(200).json({ exists: true, restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Restaurant owner adds a dish with image
exports.addDish = [
  upload.single('image'), // Middleware to handle single file upload
  async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const restaurant = await Restaurant.findById(req.params.id);

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Check if the authenticated user is the restaurant owner
      if (restaurant.ownerId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied: Only the restaurant owner can add dishes' });
      }

      const imagePath = req.file ? req.file.path : null;
      restaurant.dishes.push({ name, description, price, image: imagePath });
      await restaurant.save();

      res.status(201).json({ message: 'Dish added', restaurant });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

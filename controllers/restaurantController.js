const Restaurant = require('../models/Restaurant');

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

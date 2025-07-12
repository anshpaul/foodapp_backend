// controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

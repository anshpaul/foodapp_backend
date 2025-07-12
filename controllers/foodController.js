// controllers/foodController.js
const Food = require('../models/Food');

exports.addFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFoodsByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.restaurantId });
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

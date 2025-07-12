// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);

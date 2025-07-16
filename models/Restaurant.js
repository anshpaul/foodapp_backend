const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
  dish: { type: String },
  price: { type: Number },
  time: { type: String },
  distance: { type: String },
  rating: { type: String },
  offer: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  distance: { type: String },
  categories: { type: String },
  fssai: { type: String },
  phone: { type: String },
  imageUrl: { type: String }, // <-- Use this field for the restaurant image

  dishes: [
    {
      name: { type: String },
      description: { type: String },
      price: { type: Number },
      image: { type: String } // Store image path
    }
  ],

  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
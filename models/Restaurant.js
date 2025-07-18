const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true }, // Changed from `title` to `name`
  description: { type: String },
  address: { type: String },
  distance: { type: String },
  categories: { type: String },
  fssai: { type: String },
  phone: { type: String },
  menuImage: { type: String },

  dishes: [
    {
      name: { type: String },
      description: { type: String },
      price: { type: Number },
      image: { type: String }
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

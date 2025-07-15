const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  description: { 
    type: String 
  },
  dish: { 
    type: String 
  },
  price: { 
    type: Number 
  },
  time: { 
    type: String 
  },
  distance: { 
    type: String 
  },
  rating: { 
    type: String 
  },
  offer: { 
    type: String 
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

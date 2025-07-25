// models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  category: { 
    type: String 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Food', foodSchema);
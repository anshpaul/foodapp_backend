// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

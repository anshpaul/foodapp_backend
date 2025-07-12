// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending | accepted | out_for_delivery | delivered
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

exports.placeOrder = async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let total = 0;
  for (const item of cart.items) {
    const food = await Food.findById(item.foodId);
    total += food.price * item.quantity;
  }

  const order = new Order({
    userId,
    items: cart.items,
    totalAmount: total,
    status: 'pending'
  });

  await order.save();
  await Cart.findOneAndDelete({ userId });

  res.status(201).json(order);
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ userId }).populate('items.foodId');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('items.foodId userId');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  order.status = status;
  await order.save();

  res.json(order);
};

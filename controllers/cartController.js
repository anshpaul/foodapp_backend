// controllers/cartController.js
const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const userId = req.user.userId;
  const cart = await Cart.findOne({ userId }).populate('items.foodId');
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { foodId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [{ foodId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ foodId, quantity });
    }
  }

  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { foodId } = req.body;

  const cart = await Cart.findOne({ userId });
  cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
  await cart.save();

  res.json(cart);
};

exports.clearCart = async (req, res) => {
  const userId = req.user.userId;
  await Cart.findOneAndDelete({ userId });
  res.json({ message: 'Cart cleared' });
};

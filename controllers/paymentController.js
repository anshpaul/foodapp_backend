// controllers/paymentController.js
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay works in paise
    currency: "INR",
    receipt: "receipt_order_" + Date.now(),
  };

  try {
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Razorpay order", error: err });
  }
};

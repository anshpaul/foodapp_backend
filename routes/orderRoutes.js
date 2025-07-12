// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/all', protect, isAdmin, getAllOrders);
router.patch('/:orderId/status', protect, isAdmin, updateOrderStatus);

module.exports = router;

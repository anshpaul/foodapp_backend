// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createRazorpayOrder);

module.exports = router;

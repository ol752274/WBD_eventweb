const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

require('dotenv').config(); // make sure environment variables are loaded

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order route
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const options = {
      amount: amount, // amount is already in paise from frontend
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
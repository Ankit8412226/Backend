const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID from environment variable
  key_secret: process.env.RAZORPAY_SECRET, // Razorpay Secret from environment variable
});

module.exports = razorpayInstance;

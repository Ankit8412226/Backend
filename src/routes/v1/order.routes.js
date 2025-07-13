const express = require('express');
const router = express.Router();

const { OrderController } = require('../../controllers');


router.post('/cart', OrderController.addToCart);


router.post('/checkout', OrderController.checkout);


router.get('/user/:userId', OrderController.getUserOrders);

module.exports = router;

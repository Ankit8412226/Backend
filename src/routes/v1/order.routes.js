const express = require('express');
const router = express.Router();

const { OrderController } = require('../../controllers');


router.post('/cart', OrderController.addToCart);
router.get('/cart/:userId', OrderController.getCart);
router.put('/cart', OrderController.updateCart);
router.delete('/cart/:userId/:productId', OrderController.removeFromCart);
router.delete('/cart/:userId', OrderController.clearCart);



router.post('/checkout', OrderController.checkout);


router.get('/user/:userId', OrderController.getUserOrders);

module.exports = router;

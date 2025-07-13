const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const {Product} = require('../models');


const addToCart = catchAsync(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const index = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.status(httpStatus.OK).send(cart);
});

// ✅ Checkout and Place Order
const checkout = catchAsync(async (req, res) => {
  const { userId, address } = req.body;

  const cart = await Cart.findOne({ userId }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  let totalAmount = 0;
  const items = cart.items.map((item) => {
    totalAmount += item.productId.price * item.quantity;
    return {
      productId: item.productId._id,
      quantity: item.quantity,
    };
  });

  const order = await Order.create({
    userId,
    items,
    totalAmount,
    address,
    status: 'pending',
  });

  await Cart.deleteOne({ userId });

  res.status(httpStatus.CREATED).send({
    message: 'Order placed successfully',
    order,
  });
});


const getUserOrders = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const orders = await Order.find({ userId }).populate('items.productId');

  res.status(httpStatus.OK).send(orders);
});

module.exports = {
  addToCart,
  checkout,
  getUserOrders,
};

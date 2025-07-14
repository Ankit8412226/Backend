const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const Cart = require('../models/cart.model');
const Order = require('../models/order.model');



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

const getCart = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'UserId is required'
    });
  }

  let cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'name price image _id description category stock'
  });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }

  res.status(httpStatus.OK).send(cart);
});
const updateCart = catchAsync(async (req, res) => {
  const { userId, productId, quantity, updateType = 'set' } = req.body;

  if (!userId || !productId || quantity === undefined) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'UserId, ProductId, and quantity are required'
    });
  }

  if (quantity < 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Quantity cannot be negative'
    });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: 'Cart not found'
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: 'Item not found in cart'
    });
  }

  // If quantity is 0, remove the item
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity based on updateType
    if (updateType === 'set') {
      cart.items[itemIndex].quantity = quantity;
    } else if (updateType === 'add') {
      cart.items[itemIndex].quantity += quantity;
    }
  }

  await cart.save();


  const populatedCart = await Cart.findById(cart._id).populate({
    path: 'items.productId',
    select: 'name price image _id description category stock'
  });

  res.status(httpStatus.OK).send(populatedCart);
});

const removeFromCart = catchAsync(async (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'UserId and ProductId are required'
    });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: 'Cart not found'
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: 'Item not found in cart'
    });
  }


  cart.items.splice(itemIndex, 1);
  await cart.save();


  const populatedCart = await Cart.findById(cart._id).populate({
    path: 'items.productId',
    select: 'name price image _id description category stock'
  });

  res.status(httpStatus.OK).send(populatedCart);
});

const clearCart = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'UserId is required'
    });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  } else {
    cart.items = [];
    await cart.save();
  }

  res.status(httpStatus.OK).send({
    message: 'Cart cleared successfully',
    cart: cart
  });
});



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
  getCart,
  updateCart,
  removeFromCart,
  clearCart ,
};

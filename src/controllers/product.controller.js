const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Product, Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createProduct = catchAsync(async (req, res) => {
  const { categoryId } = req.body;


  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
  }

  const product = await Product.create(req.body);
  res.status(httpStatus.CREATED).send({ product });
});


const getProducts = catchAsync(async (req, res) => {
  const { categoryId } = req.query;

  const filter = {};
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  const products = await Product.find(filter);
  res.send({ products });
});


const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send({ product });
});

const updateProduct = catchAsync(async (req, res) => {
  const { categoryId } = req.body;

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.send({ product });
});


const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.send({ message: 'Product deleted successfully' });
});


const deleteAllProducts = catchAsync(async (req, res) => {
  await Product.deleteMany({});
  res.send({ message: 'All products deleted successfully' });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};

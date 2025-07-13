const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');


const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category already exists');
  }

  const category = await Category.create({ name });

  res.status(httpStatus.CREATED).send({ category });
});


const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.send({ categories });
});


const getCategoryById = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  res.send({ category });
});


const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  category.name = name || category.name;
  await category.save();

  res.send({ category });
});


const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  res.send({ message: 'Category deleted successfully' });
});


const deleteAllCategories = catchAsync(async (req, res) => {
  await Category.deleteMany({});
  res.send({ message: 'All categories deleted successfully' });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
};

const express = require('express');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router
  .route('/')
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories)
  .delete(categoryController.deleteAllCategories);

router
  .route('/:categoryId')
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;

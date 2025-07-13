const express = require('express');
const { productController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(productController.createProduct)
  .get(productController.getProducts)
  .delete(productController.deleteAllProducts);

router
  .route('/:productId')
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

router.route("/:cat")

module.exports = router;

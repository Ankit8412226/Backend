const express = require('express');
const authRoute = require('./auth.route');
const CategoryRoutes = require("./category.route")
const ProductRoutes = require("./product.route")
const router = express.Router();

router.use('/auth', authRoute);
router.use("/category" , CategoryRoutes)
router.use("/products" , ProductRoutes)

module.exports = router;

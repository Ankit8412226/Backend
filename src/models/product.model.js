const mongoose = require('mongoose');
const cateogry = require("./category.model")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 3.0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: cateogry,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    hoverImage: {
      type: String,
    },
    description:{
      type: String,
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

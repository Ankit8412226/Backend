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

  const products = await Product.find(filter).populate('categoryId', 'name');
  res.send({ products });
});


const seedProducts = catchAsync(async (req, res) => {
  const categories = await Category.find();
  if (categories.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No categories found to seed products');
  }

  // Define category-specific image collections using Picsum and placeholder services
  const categoryImageMap = {
    "Men's Clothing": {
      images: [
        'https://picsum.photos/400/400?random=1',
        'https://picsum.photos/400/400?random=2',
        'https://picsum.photos/400/400?random=3',
        'https://picsum.photos/400/400?random=4',
        'https://picsum.photos/400/400?random=5',
        'https://picsum.photos/400/400?random=6',
        'https://picsum.photos/400/400?random=7',
        'https://picsum.photos/400/400?random=8',
        'https://picsum.photos/400/400?random=9',
        'https://picsum.photos/400/400?random=10',
        'https://picsum.photos/400/400?random=11',
        'https://picsum.photos/400/400?random=12',
        'https://picsum.photos/400/400?random=13',
        'https://picsum.photos/400/400?random=14',
        'https://picsum.photos/400/400?random=15',
        'https://picsum.photos/400/400?random=16',
        'https://picsum.photos/400/400?random=17',
        'https://picsum.photos/400/400?random=18',
        'https://picsum.photos/400/400?random=19',
        'https://picsum.photos/400/400?random=20'
      ]
    },
    "Women's Clothing": {
      images: [
        'https://picsum.photos/400/400?random=21',
        'https://picsum.photos/400/400?random=22',
        'https://picsum.photos/400/400?random=23',
        'https://picsum.photos/400/400?random=24',
        'https://picsum.photos/400/400?random=25',
        'https://picsum.photos/400/400?random=26',
        'https://picsum.photos/400/400?random=27',
        'https://picsum.photos/400/400?random=28',
        'https://picsum.photos/400/400?random=29',
        'https://picsum.photos/400/400?random=30',
        'https://picsum.photos/400/400?random=31',
        'https://picsum.photos/400/400?random=32',
        'https://picsum.photos/400/400?random=33',
        'https://picsum.photos/400/400?random=34',
        'https://picsum.photos/400/400?random=35',
        'https://picsum.photos/400/400?random=36',
        'https://picsum.photos/400/400?random=37',
        'https://picsum.photos/400/400?random=38',
        'https://picsum.photos/400/400?random=39',
        'https://picsum.photos/400/400?random=40'
      ]
    },
    'Footwear': {
      images: [
        'https://picsum.photos/400/400?random=41',
        'https://picsum.photos/400/400?random=42',
        'https://picsum.photos/400/400?random=43',
        'https://picsum.photos/400/400?random=44',
        'https://picsum.photos/400/400?random=45',
        'https://picsum.photos/400/400?random=46',
        'https://picsum.photos/400/400?random=47',
        'https://picsum.photos/400/400?random=48',
        'https://picsum.photos/400/400?random=49',
        'https://picsum.photos/400/400?random=50',
        'https://picsum.photos/400/400?random=51',
        'https://picsum.photos/400/400?random=52',
        'https://picsum.photos/400/400?random=53',
        'https://picsum.photos/400/400?random=54',
        'https://picsum.photos/400/400?random=55',
        'https://picsum.photos/400/400?random=56',
        'https://picsum.photos/400/400?random=57',
        'https://picsum.photos/400/400?random=58',
        'https://picsum.photos/400/400?random=59',
        'https://picsum.photos/400/400?random=60'
      ]
    },
    'Accessories': {
      images: [
        'https://picsum.photos/400/400?random=61',
        'https://picsum.photos/400/400?random=62',
        'https://picsum.photos/400/400?random=63',
        'https://picsum.photos/400/400?random=64',
        'https://picsum.photos/400/400?random=65',
        'https://picsum.photos/400/400?random=66',
        'https://picsum.photos/400/400?random=67',
        'https://picsum.photos/400/400?random=68',
        'https://picsum.photos/400/400?random=69',
        'https://picsum.photos/400/400?random=70',
        'https://picsum.photos/400/400?random=71',
        'https://picsum.photos/400/400?random=72',
        'https://picsum.photos/400/400?random=73',
        'https://picsum.photos/400/400?random=74',
        'https://picsum.photos/400/400?random=75',
        'https://picsum.photos/400/400?random=76',
        'https://picsum.photos/400/400?random=77',
        'https://picsum.photos/400/400?random=78',
        'https://picsum.photos/400/400?random=79',
        'https://picsum.photos/400/400?random=80'
      ]
    },
    'Ethnic & Traditional Wear': {
      images: [
        'https://picsum.photos/400/400?random=81',
        'https://picsum.photos/400/400?random=82',
        'https://picsum.photos/400/400?random=83',
        'https://picsum.photos/400/400?random=84',
        'https://picsum.photos/400/400?random=85',
        'https://picsum.photos/400/400?random=86',
        'https://picsum.photos/400/400?random=87',
        'https://picsum.photos/400/400?random=88',
        'https://picsum.photos/400/400?random=89',
        'https://picsum.photos/400/400?random=90',
        'https://picsum.photos/400/400?random=91',
        'https://picsum.photos/400/400?random=92',
        'https://picsum.photos/400/400?random=93',
        'https://picsum.photos/400/400?random=94',
        'https://picsum.photos/400/400?random=95',
        'https://picsum.photos/400/400?random=96',
        'https://picsum.photos/400/400?random=97',
        'https://picsum.photos/400/400?random=98',
        'https://picsum.photos/400/400?random=99',
        'https://picsum.photos/400/400?random=100'
      ]
    }
  };

  const productNames = [
    'Premium Cotton Shirt',
    'Casual Slim Fit T-Shirt',
    'Lightweight Hoodie',
    'Stylish Denim Jeans',
    'Classic Polo',
    'Woolen Sweater',
    'Relaxed Fit Cargo',
    'Formal Blazer',
    'Activewear Shorts',
    'Printed Kurta',
    'Ankle Boots',
    'High Heels',
    'Leather Sandals',
    'Statement Necklace',
    'Smartwatch Band',
    'Elegant Saree',
    'Patiala Suit',
    'Lehenga Choli',
    'Printed Dupatta',
    'Ethnic Waistcoat',
  ];

  const allProducts = [];

  for (const category of categories) {
    // Get the appropriate image mapping for this category
    const imageMapping = categoryImageMap[category.name];

    for (let i = 0; i < 20; i++) {
      const name = `${productNames[i % productNames.length]} - ${category.name}`;

      let image, hoverImage;

      if (imageMapping && imageMapping.images) {
        // Use category-specific images from the predefined array
        image = imageMapping.images[i % imageMapping.images.length];
        // Create hover image with different parameters
        hoverImage = `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000) + 1000}&grayscale`;
      } else {
        // Fallback to generic placeholder images
        image = `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`;
        hoverImage = `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000) + 500}&blur=1`;
      }

      const price = Math.floor(Math.random() * 1000 + 499);
      const rating = (Math.random() * 2 + 3).toFixed(1);
      const reviews = Math.floor(Math.random() * 1000);
      const description = `Introducing our ${name}, crafted for comfort and style. Perfect for any occasion.`;

      allProducts.push({
        name,
        price,
        rating,
        reviews,
        categoryId: category._id,
        image,
        hoverImage,
        description,
      });
    }
  }

  await Product.insertMany(allProducts);
  res.status(httpStatus.CREATED).send({
    message: 'Products seeded successfully',
    count: allProducts.length,
  });
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
  seedProducts,
};

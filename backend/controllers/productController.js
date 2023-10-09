const Product = require("../models/productModel");
const router = require("../routes/productRoute");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const { compare } = require("bcryptjs");
const cloudinary = require("cloudinary");

// Create Product  ---Only Access For Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, images, category, stock } = req.body;
  let imagesLink = [];
  let user = req.user.id;

  // Validate required fields
  if (!name || !description || !price || !category || !stock) {
    return next(
      new ErrorHandler("Please provide all required product details.", 400)
    );
  }

  // Validate price and stock
  if (typeof price !== "number" || isNaN(price) || price <= 0) {
    return next(
      new ErrorHandler("Please provide a valid price greater than 0.", 400)
    );
  }

  if (typeof stock !== "number" || isNaN(stock) || stock < 0) {
    return next(
      new ErrorHandler(
        "Please provide a valid stock value greater than or equal to 0.",
        400
      )
    );
  }

  // Validate images
  if (!Array.isArray(images) || images.length === 0) {
    return next(
      new ErrorHandler(
        "Please provide at least one image for the product.",
        400
      )
    );
  }

  try {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "Products",
        transformation: [{ width: 1080, height: 1080 }],
      });

      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  } catch (error) {
    return next(
      new ErrorHandler("Error uploading images. Please try again later.", 500)
    );
  }

  const productData = {
    name,
    description,
    price,
    images: imagesLink, //array
    category,
    stock,
    user: user,
  };
  const product = await Product.create(productData);
  if (!product) {
    return next(
      new ErrorHandler(
        "Error creating the product. Please try again later.",
        500
      )
    );
  }
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeaturesForFilter = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeaturesForFilter.query;
  let filteredProductsCount = products.length;

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  products = await apiFeatures.query;
  if (!products) {
    return next(new ErrorHandler("Product not Found", 404));
  }
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get all Products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  let products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Update Product ---Admin Access only
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { images } = req.body;
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  if (product && images && images.length > 0) {
    //Delete Images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }
    // Upload New Images into Cloudinary
    let imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "Products",
        transformation: [{ width: 1080, height: 1080 }],
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLink;
  } else {
    delete req.body.images;
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product ---only Admin Access

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  //delete Images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar?.url,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// GEt All Reviews OF a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});

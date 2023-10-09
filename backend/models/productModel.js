const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [
      true,
      "Don't forget to name your masterpiece! Please enter the Product Name.",
    ],
    trim: true,
    validate: {
      validator: function (value) {
        return (
          value.length < 100 ||
          "Whoa! This product name is longer than a Shakespearean play. Please keep it under 100 characters."
        );
      },
    },
  },

  description: {
    type: String,
    required: [
      true,
      "Your product deserves a captivating story! Please provide a Product Description.",
    ],
  },
  price: {
    type: Number,
    required: [
      true,
      "Hold on! You can't sell your soul for free. Please Enter Product Price.",
    ],
    maxLength: [
      8,
      "Price should be within a reasonable range. We're not dealing with galactic credits here!",
    ],
    validate: {
      validator: function (value) {
        return (
          !(value < 0) ||
          "Price cannot be negative. Are you paying customers to take your products?"
        );
      },
    },
  },

  ratings: {
    type: Number,
    default: 0,
    min: [
      0,
      "Oops! Ratings cannot go below 0. We haven't invented anti-gravity products yet!",
    ],
    max: [
      5,
      "Wow! Ratings above 5? Our products are good, but not intergalactic standard!",
    ],
  },
  images: [
    {
      public_id: {
        type: String,
        required: [
          true,
          "Oops! The image needs a unique ID. Please provide a Public ID.",
        ],
      },
      url: {
        type: String,
        required: [
          true,
          "Hey there! Where's the image? Please provide a URL for the Image.",
        ],
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "Hold up! The product needs a category to belong to. Please Enter Product Category.",
    ],
  },
  stock: {
    type: Number,
    required: [
      true,
      "Oh no! The product can't be invisible. Please Enter Product Stock.",
    ],
    maxLength: [
      4,
      "Stock can't exceed 4 characters. Unless it's a secret code!",
    ],
    validate: {
      validator: function (value) {
        return (
          !(value < 0) ||
          "Oops! Negative stock? Are you running a reverse store where customers send you products?"
        );
      },
    },
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      avatar: {
        type: String,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
productSchema.path("reviews").validate(function (value) {
  return (
    value.length === 0 ||
    value.some((review) => review.rating || review.comment)
  );
}, "You must provide a rating or a comment in at least one review. Let us know what you think!");

module.exports = mongoose.model("Product", productSchema);

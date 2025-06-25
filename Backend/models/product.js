const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageType: String,
  imageData: Buffer,
  email: String,
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 }, // default value of 0
});

// Method to calculate the average rating
productSchema.methods.updateAverageRating = function () {
  const totalRatings = this.ratings.length;
  const sumRatings = this.ratings.reduce(
    (sum, ratingObj) => sum + ratingObj.rating,
    0
  );
  this.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
};

// Middleware to update average rating before saving
productSchema.pre("save", function (next) {
  this.updateAverageRating();
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
